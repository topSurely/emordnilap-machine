import { Assets, Graphics as DrawGraphics } from 'pixi.js';
import { Stage, Container, BitmapText, Graphics, useTick } from '@pixi/react';
import { useEffect, useState } from 'react';
import { Vector2 } from '@graph-ts/vector2';

export default function MachineStage({ text, width, height }: { text: string, width: number, height: number }) {

    return (
        <>
            <Stage options={{ background: "black" }} width={width} height={height}>
                <Emordnilap text={text} height={height} width={width} />
            </Stage>
        </>
    )
}
function Emordnilap({ text, width, height }: { text: string, width: number, height: number }) {
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
        const elements: JSX.Element[] = [];
        for (let index = 0; index < text.length; index++) {
            const element = text[index];
            elements.push(<SingleLetter char={element} index={index} position={{ x: width / 2, y: height / 2 }} />)
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
        setRotation(rotation + delta / 360)
    })
    return (
        <>
            <Graphics draw={drawRect} pivot={[rectWidth / 2, 35 / 2]} x={width / 2} rotation={rotation} y={height / 2} />
            {
                fontLoaded &&
                renderLetters()
            }
        </>
    )
}
function SingleLetter({ char, index, position }: { char: string, index: number, position: Vector2 }) {
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