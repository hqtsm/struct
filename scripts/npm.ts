// deno-lint-ignore-file no-top-level-await no-console

import { build, type BuildOptions, emptyDir } from '@deno/dnt';

import denoJson from '../deno.json' with { type: 'json' };

if (Deno.args.length !== 1 || !/^(dev|prod)$/.test(Deno.args[0])) {
	console.error('Args: dev|prod');
	Deno.exit(1);
}

const [env] = Deno.args;

const mappings: BuildOptions['mappings'] = {
	'jsr:@hqtsm/dataview': '@hqtsm/dataview',
};

const GITHUB_REPOSITORY = Deno.env.get('GITHUB_REPOSITORY');

const readme = (await Deno.readTextFile('README.md')).split(/[\r\n]+/);
const [description] = readme.filter((s) => /^\w/.test(s));
const keywords = readme.map((s) => s.match(/^\!\[(.*)\]\((.*)\)$/))
	.filter((m) => m && m[2].startsWith('https://img.shields.io/badge/'))
	.map((m) => m![1]);

const replace = new Map<string, string>();
for (const [k, v] of Object.entries(denoJson.imports)) {
	const m = v.match(/^(jsr:(@.*))@([^@]*)$/);
	if (m) {
		const o = mappings[m[1]];
		if (o) {
			const url = `https://jsr.io/${m[2]}`;
			delete mappings[m[1]];
			mappings[url] = {
				version: m[3],
				...(typeof o === 'string' ? { name: o } : o),
			};
			replace.set(k, url);
		}
	}
}
if (replace.size) {
	const reg = /\.m?[tj]sx?$/i;
	const desc = Object.getOwnPropertyDescriptor(Deno, 'readFile')!;
	const value = desc.value!;
	desc.value = async function readFile(
		path: string | URL,
		_options?: Deno.ReadFileOptions,
	): Promise<Uint8Array> {
		let r = await value.apply(this, arguments);
		if (reg.test(typeof path === 'string' ? path : path.pathname)) {
			r = new TextEncoder().encode(
				new TextDecoder().decode(r).replace(
					/(['"])([^'"]+)(['"])/g,
					(_0, q1, s, q2) => `${q1}${replace.get(s) ?? s}${q2}`,
				),
			);
		}
		return r;
	};
	Object.defineProperty(Deno, 'readFile', desc);
}

const outDir = './npm';

await emptyDir(outDir);

await build({
	test: env === 'dev',
	importMap: 'deno.json',
	entryPoints: Object.entries(denoJson.exports)
		.map(([name, path]) => name === '.' ? path : { name, path }),
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
	typeCheck: 'both',
	compilerOptions: {
		lib: ['ESNext'],
		sourceMap: true,
	},
	async postBuild(): Promise<void> {
		await Promise.all([
			Deno.copyFile('LICENSE.txt', 'npm/LICENSE.txt'),
			Deno.copyFile('README.md', 'npm/README.md'),
			Deno.writeTextFile(
				'npm/.npmignore',
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
