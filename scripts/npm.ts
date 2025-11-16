// deno-lint-ignore-file no-top-level-await no-console

import { build, type BuildOptions, emptyDir } from '@deno/dnt';
import denoJson from '../deno.json' with { type: 'json' };

if (Deno.args.length !== 1 || !/^(dev|prod)$/.test(Deno.args[0])) {
	console.error('Args: dev|prod');
	Deno.exit(1);
}

const [env] = Deno.args;

const mappings: BuildOptions['mappings'] = {
	'jsr:@hqtsm/dataview/float/16': '@hqtsm/dataview',
	'jsr:@hqtsm/dataview/int/24': '@hqtsm/dataview',
	'jsr:@hqtsm/meek/valuemap': '@hqtsm/meek',
	'jsr:@hqtsm/class': '@hqtsm/class',
};

const GITHUB_REPOSITORY = Deno.env.get('GITHUB_REPOSITORY');

const readme = (await Deno.readTextFile('README.md')).split(/[\r\n]+/);
const [description] = readme.filter((s) => /^\w/.test(s));
const keywords = readme.map((s) => s.match(/^\!\[(.*)\]\((.*)\)$/))
	.filter((m) => m && m[2].startsWith('https://img.shields.io/badge/'))
	.map((m) => m![1]);

const entryPoints = [];
let types: string | undefined;
let typed: { [s: string]: string[] } | null = null;
for (const [name, path] of Object.entries(denoJson.exports)) {
	const d = path.replace(/^(\.\/)?(.*)(\.[^.]+)$/i, './esm/$2.d$3');
	if (name === '.') {
		entryPoints.unshift(path);
		types = d;
	} else {
		entryPoints.push({ name, path });
		(typed ??= {})[name.replace(/^\.\//, '')] = [d];
	}
}

// Monkey patch for broken JSR mappings, also add version and subpath info.
const replace = new Map<string, string>();
const jsrs = Object.keys(mappings).filter((s) => s.startsWith('jsr:'));
const jsrm = /^(jsr:(@.*))@([^@]*)$/;
for (const [ik, iv] of Object.entries(denoJson.imports)) {
	const m = iv.match(jsrm);
	if (m) {
		const [, j, name, version] = m;
		for (const k of jsrs.filter((s) => s === j || s.startsWith(`${j}/`))) {
			const sub = k.substring(j.length);
			const url = `https://jsr.io/${name}${sub}`;
			const o = mappings[k];
			delete mappings[k];
			mappings[url] = {
				version,
				...(sub ? { subPath: sub.substring(1) } : {}),
				...(typeof o === 'string' ? { name: o } : o),
			};
			replace.set(`${ik}${sub}`, url);
		}
	}
}
if (replace.size) {
	const reg = /\.m?[tj]sx?$/i;
	const dec = new TextDecoder();
	const enc = new TextEncoder();
	const desc = Object.getOwnPropertyDescriptor(Deno, 'openSync')!;
	const value = desc.value!;
	desc.value = function openSync(
		path: string | URL,
		options?: Deno.OpenOptions,
	): Deno.FsFile {
		const f = value.apply(this, arguments) as Deno.FsFile;
		if (
			options?.write ||
			options?.create ||
			options?.truncate ||
			options?.append ||
			options?.createNew ||
			!reg.test(typeof path === 'string' ? path : path.pathname)
		) {
			return f;
		}

		const st = f.statSync();
		if (!st.isFile) {
			return f;
		}

		let body = new Uint8Array(st.size);
		f.readSync(body);
		f.close();

		body = enc.encode(
			dec.decode(body).replace(
				/(['"])([^'"]+)(['"])/g,
				(_0, q1, s, q2) => `${q1}${replace.get(s) ?? s}${q2}`,
			),
		);

		let pos = 0;
		f.readSync = function readSync(d: Uint8Array): number | null {
			if (pos < body.byteLength) {
				const view = body.slice(pos, pos + d.byteLength);
				d.set(view);
				pos += view.byteLength;
				return view.byteLength;
			}
			return null;
		};
		f.close = function close(): void {};
		return f;
	};
	Object.defineProperty(Deno, 'openSync', desc);
}

const outDir = './npm';

await emptyDir(outDir);

await build({
	test: env === 'dev',
	importMap: 'deno.json',
	entryPoints,
	outDir,
	shims: {
		deno: env === 'dev' ? 'dev' : false,
	},
	mappings,
	package: {
		name: denoJson.name,
		version: denoJson.version,
		description,
		keywords,
		license: denoJson.license,
		sideEffects: false,
		types,
		...(typed ? { typesVersions: { '*': typed } } : {}),
		...(env !== 'prod' ? { private: true } : {}),
		...(GITHUB_REPOSITORY
			? {
				repository: {
					type: 'git',
					url: `git+https://github.com/${GITHUB_REPOSITORY}.git`,
				},
				bugs: {
					url: `https://github.com/${GITHUB_REPOSITORY}/issues`,
				},
			}
			: {}),
	},
	esModule: true,
	scriptModule: false,
	declaration: 'inline',
	typeCheck: 'both',
	compilerOptions: {
		target: 'Latest',
		lib: ['ESNext'],
		sourceMap: true,
	},
	async postBuild(): Promise<void> {
		await Promise.all([
			Deno.copyFile('LICENSE.txt', `${outDir}/LICENSE.txt`),
			Deno.copyFile('README.md', `${outDir}/README.md`),
			Deno.writeTextFile(
				`${outDir}/.npmignore`,
				[
					'.*',
					'ehthumbs.db',
					'Thumbs.db',
					'node_modules',
					'package-lock.json',
					'',
				].join('\n'),
			),
		]);
	},
});
