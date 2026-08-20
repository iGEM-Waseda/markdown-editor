/** URL文字列か判定する */
export declare function isValidHttpUrl(str: string): boolean;
export declare function isGithubUrl(url: string): boolean;
export declare function isGistUrl(url: string): boolean;
export declare function isTweetUrl(url: string): boolean;
export declare function isStackblitzUrl(url: string): boolean;
export declare function isCodesandboxUrl(url: string): boolean;
export declare function isCodepenUrl(url: string): boolean;
export declare function isJsfiddleUrl(url: string): boolean;
export declare function isYoutubeUrl(url: string): boolean;
/**
 * youtube の URL から videoId と開始位置の秒数を取得する
 */
export declare function extractYoutubeVideoParameters(youtubeUrl: string): {
    videoId: string;
    start?: string;
} | undefined;
/**
 * 参考: https://blueprintue.com/
 * 生成されるURLをもとに正規表現を定義した
 */
export declare function isBlueprintUEUrl(url: string): boolean;
/**
 * 参考: https://www.figma.com/developers/embed
 */
export declare function isFigmaUrl(url: string): boolean;
