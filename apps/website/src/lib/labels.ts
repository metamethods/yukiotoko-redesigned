import semver from 'semver';

const gameVersionLabels: { range: string; label: string }[] = [
	{ range: '>=2.0.x <=2.2.x', label: 'new' },
	{ range: '2.5.x', label: 'new_plus' },
	{ range: '>=2.10.x <=2.11.x', label: 'sun' },
	{ range: '>=2.15.x <=2.16.x', label: 'sun_plus' },
	{ range: '>=2.20.x <=2.22.x', label: 'luminous' },
	{ range: '>=2.25.x <=2.27.x', label: 'luminous_plus' },
	{ range: '2.30.x', label: 'verse' }
];

export function getGameVersionLabel(version: string): string | undefined {
	for (const { range, label } of gameVersionLabels) {
		if (semver.satisfies(version, range, true)) return label;
	}
}
