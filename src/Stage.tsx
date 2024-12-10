import { Assets, Graphics as DrawGraphics } from 'pixi.js';
import { Stage, Container, BitmapText, Graphics, useTick } from '@pixi/react';
import { useEffect, useState } from 'react';
import { Vector2 } from '@catsums/vector2';

export default function MachineStage({ text, width, height }: { text: string, width: number, height: number }) {
    const [cursorType, setCursorType] = useState<CursorType>(CursorType.Free)
    const [cursor, setCursor] = useState<string>("inherit")

    useEffect(() => {
        console.log("hoverin")
        switch (cursorType) {
            case CursorType.Free:
                setCursor("inherit")
                break;
            case CursorType.Hold:
                setCursor("grabbing")
                break;
            case CursorType.Hover:
                setCursor("grab")
                break;
        }
    }, [cursorType])

    return (
        <>
            <Stage options={{ background: "black", antialias: true }} width={width} height={height} style={{ cursor: cursor }}>
                <Emordnilap text={text} height={height} width={width} setCursorState={setCursorType} />
            </Stage>
        </>
    )
}
enum CursorType {
    Free,
    Hover,
    Hold
}
function Emordnilap({ text, width, height, setCursorState }: { text: string, width: number, height: number, setCursorState: (newState: CursorType) => void }) {
    const [fontLoaded, setFontLoaded] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(0);
    const [rectWidth, setRectWidth] = useState<number>(30);
    useEffect(() => {
        Assets.load('/font/chewy.xml').then(() => {
            setFontLoaded(true)
            console.log("Loaded font!")
        })
    }, [])
    useEffect(() => {
        setRectWidth(30 + text.length * 35)
    }, [text])
    const renderLetters = () => {
        const middle = new Vector2(width / 2, height / 2);
        const from = new Vector2((middle.x - (rectWidth / 2)) + 35 / 2, middle.y);
        const to = new Vector2((middle.x + (rectWidth / 2)) + 35 / 2, middle.y);
        from.rotateAround(middle, rotation);
        to.rotateAround(middle, rotation);

        const elements: JSX.Element[] = [];
        for (let index = 0; index < text.length; index++) {
            const element = text[index];
            const t = index / text.length;
            const pos = from.lerp(to, t);

            elements.push(<SingleLetter char={element} index={index} position={pos} />)
        }
        return elements
    }
    const drawRect = (g: DrawGraphics) => {
        g.clear();
        g.beginFill("grey")
        g.drawRoundedRect(0, 0, rectWidth, 35, 15);
        g.endFill();
    }
    useTick((delta) => {
        // setRotation(rotation + delta / 36)
    })
    return (
        <>
            <Graphics draw={drawRect} pivot={[rectWidth / 2, 35 / 2]} x={width / 2} eventMode={'dynamic'} rotation={rotation} y={height / 2} onmouseenter={() => setCursorState(CursorType.Hover)} onmouseleave={() => setCursorState(CursorType.Free)} />
            {
                fontLoaded &&
                renderLetters()
            }
        </>
    )
}
function SingleLetter({ char, position }: { char: string, index: number, position: Vector2 }) {
    return (
        <>
            <Container x={position.x} y={position.y}>
                <Graphics draw={
                    (g) => {
                        g.clear();
                        g.beginFill("red")
                        g.drawCircle(0, 0, 5)
                        g.endFill();
                    }
                } />
                <BitmapText text={char} anchor={[0.5, 0.6]} fontSize={35} style={{ fontName: 'Chewy', align: 'center' }} />
            </Container>
        </>
    )
}