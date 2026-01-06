import { YukiotokoInstance } from './lib';

export const yukiotokoInstances = [
	new YukiotokoInstance('yukiotoko', 'Yukiotoko', 'http://yukiotoko.chara.lol', Bun.env.YUKIOTOKO_API_TOKEN)
] satisfies YukiotokoInstance[];
