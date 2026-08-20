import type Token from 'markdown-it/lib/token';
export declare const containerDetailsOptions: {
    validate: (params: string) => boolean;
    render: (tokens: Token[], idx: number) => string;
};
export declare const containerMessageOptions: {
    validate: (params: string) => boolean;
    render: (tokens: Token[], idx: number) => string;
};
export declare const containerCOptions: {
    validate: (params: string) => boolean;
    render: (tokens: Token[], idx: number) => "<div class=\"fig-table-caption\">" | "</div>\n";
};
export declare const containerLeftOptions: {
    validate: (params: string) => boolean;
    render: (tokens: Token[], idx: number) => "</div>\n" | "<div class=\"container-columns\"><div class=\"container-left\">";
};
export declare const containerRightOptions: {
    validate: (params: string) => boolean;
    render: (tokens: Token[], idx: number) => "<div class=\"container-right\">" | "</div></div>\n";
};
