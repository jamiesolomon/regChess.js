import { Chess as ChessClass, DEFAULT_POSITION } from '../src/chess'

// We need to use `Chess as any` to access private property
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
const Chess = ChessClass as any
const e4Fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'

test('_positionCounts - counts repeated positions', () => {
    const chess = new Chess()
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(1)

    const fens: string[] = [DEFAULT_POSITION]
    const moves: string[] = ['Nf3', 'Nf6', 'Ng1', 'Ng8']
    for (const move of moves) {
        for (const fen of fens) {
            expect(chess._positionCounts[fen]).toBe(1)   
        }
        chess.move(move)
        fens.push(chess.fen())
    }
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(2)
    expect(chess._positionCounts.length).toBe(4)
})

test('_positionCounts - removes when undo', () => {
    const chess = new Chess()
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(1)
    expect(chess._positionCounts[e4Fen]).toBe(0)
    chess.move('e4')
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(1)
    expect(chess.fen()).toBe(e4Fen)
    expect(chess._positionCounts[e4Fen]).toBe(1)

    chess.undo()
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(1)    
    expect(chess._positionCounts[e4Fen]).toBe(0)
    expect(chess._positionCounts.length).toBe(1)
})

test('_positionCounts - resets when cleared', () => {
    const chess = new Chess()

    chess.move('e4')
    chess.clear()
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(0)
    expect(chess._positionCounts.length).toBe(0)
})

test('_positionCounts - resets when loading FEN', () => {
    const chess = new Chess()
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(1)
    chess.move('e4')
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(1)    
    expect(chess._positionCounts[e4Fen]).toBe(1)

    const newFen = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2'
    chess.load(newFen)
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(0)
    expect(chess._positionCounts[e4Fen]).toBe(0)
    expect(chess._positionCounts[newFen]).toBe(1)
    expect(chess._positionCounts.length).toBe(1)
})

test('_positionCounts - resets when loading PGN', () => {
    const chess = new Chess()
    chess.move('e4')

    chess.loadPgn('1. d4 d5')
    expect(chess._positionCounts[DEFAULT_POSITION]).toBe(1)
    expect(chess._positionCounts[e4Fen]).toBe(0)
    expect(chess._positionCounts['rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1']).toBe(1)
    expect(chess._positionCounts['rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2']).toBe(1)
    expect(chess._positionCounts.length).toBe(3)
})