// deno-lint-ignore-file no-console

if (Deno.args.length !== 1) {
	console.error('Args: version');
	Deno.exit(1);
}

const [version] = Deno.args;
Deno.writeTextFileSync(
	'deno.json',
	Deno.readTextFileSync('deno.json').replace(
		/("version":\s*)"[^"]*"/,
		(_, p) => p + JSON.stringify(version),
	),
);
