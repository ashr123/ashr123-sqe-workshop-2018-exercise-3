export interface Program {
    type: 'Program';
    sourceType: 'script';
    body: StatementListItem[];
    loc: SourceLocation;
}

export interface Position {
    line: number;
    column: number;
}

export interface SourceLocation {
    start: Position;
    end: Position;
    source?: string | null;
}

export type Expression =
    Identifier
    | Literal
    // | FunctionExpression
    | ConditionalExpression
    | AssignmentExpression
    | BinaryExpression
    | MemberExpression
    | UnaryExpression
    | UpdateExpression;

export interface UpdateExpression {
    type: 'UpdateExpression';
    operator: '++' | '--';
    argument: Expression;
    prefix: boolean;
    loc: SourceLocation;
}

export interface UnaryExpression {
    type: 'UnaryExpression';
    operator: '+' | '-' | '~' | '!' | 'delete' | 'void' | 'typeof';
    argument: Expression;
    prefix: true;
    loc: SourceLocation;
}

export interface BinaryExpression {
    type: 'BinaryExpression';
    operator: 'instanceof' | 'in' | '+' | '-' | '*' | '/' | '%' | '**' |
        '|' | '^' | '&' | '==' | '!=' | '===' | '!==' |
        '<' | '>' | '<=' | '<<' | '>>' | '>>>';
    left: Expression;
    right: Expression;
    loc: SourceLocation;
}

export interface Identifier {
    type: 'Identifier';
    name: string;
    loc: SourceLocation;
}

export interface MemberExpression {
    type: 'MemberExpression';
    computed: boolean;
    object: Expression;
    property: Expression;
    loc: SourceLocation;
}

export interface Literal {
    type: 'Literal';
    value: boolean | number | string | RegExp | null;
    raw: string;
    regex?: {
        pattern: string,
        flags: string
    };
    loc: SourceLocation;
}

export interface ConditionalExpression {
    type: 'ConditionalExpression';
    test: Expression;
    consequent: Expression;
    alternate: Expression;
    loc: SourceLocation;
}

export interface AssignmentExpression {
    type: 'AssignmentExpression';
    operator: '=' | '*=' | '**=' | '/=' | '%=' | '+=' | '-=' | '<<=' | '>>=' | '>>>=' | '&=' | '^=' | '|=';
    left: Expression;
    right: Expression;
    loc: SourceLocation;
}

export type Statement =
    BlockStatement
    | BreakStatement
    | DoWhileStatement
    | EmptyStatement
    | ExpressionStatement
    | ForStatement
    | FunctionDeclaration
    | IfStatement
    | ReturnStatement
    | VariableDeclaration
    | WhileStatement;

export type Declaration = FunctionDeclaration | VariableDeclaration;

export type StatementListItem = Declaration | Statement;

export interface BlockStatement {
    type: 'BlockStatement';
    body: StatementListItem[];
    loc: SourceLocation;
}

export interface BreakStatement {
    type: 'BreakStatement';
    label: Identifier | null;
    loc: SourceLocation;
}

export interface DoWhileStatement {
    type: 'DoWhileStatement';
    body: Statement;
    test: Expression;
    loc: SourceLocation;
}

export interface Line {
    line: number,
    type: string,
    name: string,
    condition: string,
    value: string
}

export interface EmptyStatement {
    type: 'EmptyStatement';
    loc: SourceLocation;
}

export interface ExpressionStatement {
    type: 'ExpressionStatement';
    expression: Expression;
    directive?: string;
    loc: SourceLocation;
}

export interface ForStatement {
    type: 'ForStatement';
    init: Expression | VariableDeclaration | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
    loc: SourceLocation;
}

// export interface FunctionExpression {
//     type: 'FunctionExpression';
//     id: Identifier | null;
//     params: Identifier[];
//     body: BlockStatement;
//     generator: boolean;
//     async: boolean;
//     expression: boolean;
//     loc: SourceLocation;
// }

export interface FunctionDeclaration {
    type: 'FunctionDeclaration';
    id: Identifier | null;
    params: Identifier[];
    body: BlockStatement;
    generator: boolean;
    async: boolean;
    expression: false;
    loc: SourceLocation;
}

export interface IfStatement {
    type: 'IfStatement';
    test: Expression;
    consequent: Statement;
    alternate?: Statement;
    loc: SourceLocation;
}

export interface ReturnStatement {
    type: 'ReturnStatement';
    argument: Expression | null;
    loc: SourceLocation;
}

export interface VariableDeclaration {
    type: 'VariableDeclaration';
    declarations: VariableDeclarator[];
    kind: 'var' | 'const' | 'let';
    loc: SourceLocation;
}

export interface VariableDeclarator {
    type: 'VariableDeclarator';
    id: Identifier;
    init: Expression | null;
    loc: SourceLocation;
}

export interface WhileStatement {
    type: 'WhileStatement';
    test: Expression;
    body: Statement;
    loc: SourceLocation;
}