import {
    AssignmentExpression,
    BlockStatement,
    BreakStatement,
    Expression,
    ForStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Line,
    Literal,
    ReturnStatement,
    Statement,
    UpdateExpression,
    VariableDeclaration,
    WhileStatement
} from './programInterfaces';

interface varVal {
    var: string,
    exp: AssignmentExpression
}

let tableData=[]