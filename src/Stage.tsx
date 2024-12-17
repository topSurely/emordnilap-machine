import { Assets, Color, Graphics as DrawGraphics } from 'pixi.js';
import { Stage, Container, BitmapText, Graphics, useTick } from '@pixi/react';
import { useEffect, useState } from 'react';
import { Vector2 } from '@catsums/vector2';

export default function MachineStage({ text, width, height }: { text: string, width: number, height: number }) {

    const [mousePosition, setMousePosition] = useState<Vector2>(new Vector2())
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition(new Vector2(e.clientX - rect.left, e.clientY - rect.top))
    }

    return (
        <Stage
            options={{ background: "black", antialias: true }} width={width} height={height} onPointerMove={handleMouseMove} onPointerDown={handleMouseMove} >
            <Emordnilap text={text} height={height} width={width} mousePosition={mousePosition} />
        </Stage>
    )
}
enum CursorType {
    Free,
    Hover,
    Hold
}
function Emordnilap({ text, width, height, mousePosition }: { text: string, width: number, height: number, mousePosition: Vector2 }) {
    const [fontLoaded, setFontLoaded] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(0);
    const [rotationalVelocity, setRotationalVelocity] = useState<number>(0)
    const [rectWidth, setRectWidth] = useState<number>(30);
    const [hovering, setHovering] = useState<boolean>(false);
    const [grabbing, setGrabbing] = useState<boolean>(false);
    const [cursorState, setCursorState] = useState<CursorType>(CursorType.Free);
    const [leftSide, setLeftSide] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    useEffect(() => {
        if (grabbing) setCursorState(CursorType.Hold)
        else if (hovering) setCursorState(CursorType.Hover)
        else setCursorState(CursorType.Free)


    }, [hovering, grabbing])
    useEffect(() => {
        switch (cursorState) {
            case CursorType.Hold:
                document.body.style.cursor = "grabbing"
                break;
            case CursorType.Hover:
                document.body.style.cursor = "grab"
                break
            default:
                document.body.style.cursor = ""
        }
    }, [cursorState])
    useEffect(() => {
        setReset(true)
    }, [text])
    useEffect(() => {
        if (grabbing)
            setReset(false)
    }, [grabbing])
    useEffect(() => {
        Assets.load('./font/chewy.xml').then(() => {
            setFontLoaded(true)
            console.log("Loaded font!")
        })
        document.body.onpointerup = () => {
            setGrabbing(false);
        }
    }, [])
    useEffect(() => {
        setRectWidth(30 + text.length * 35)
    }, [text])
    let letterIndex = 0
    const renderLetters = () => {
        const middle = new Vector2(width / 2, height / 2);
        const from = new Vector2((middle.x - (rectWidth / 2)) + (35 / 2), middle.y);
        const to = new Vector2((middle.x + (rectWidth / 2)) + (35 / 2), middle.y);
        from.rotateAround(middle, rotation);
        to.rotateAround(middle, rotation);

        const elements: JSX.Element[] = [];
        for (let index = 0; index < text.length; index++) {
            const element = text[index];
            const t = index / text.length;
            const pos = from.lerp(to, t);
            const color = new Color({ h: Math.random() * 100, s: 100, l: 70 });
            elements.push(<SingleLetter char={element} index={index} position={pos} color={color} key={letterIndex++} />)
        }
        return elements
    }
    const drawRect = (g: DrawGraphics) => {
        g.clear();
        g.beginFill("grey")
        g.drawRoundedRect(0, 0, rectWidth, 35, 15);
        g.endFill();
    }
    const getLeftSide = (): boolean => {
        const offset = new Vector2(width / 2, height / 2)
        offset.subtract(mousePosition)
        const point = offset.normalized()
        const angled = Vector2.RIGHT
        angled.rotateAround(Vector2.ZERO, rotation)
        const angleDiff = angled.angleTo(point)
        console.log("Angle diff:", angle(angleDiff, 0))
        return angle(angleDiff, 0) > Math.PI / 2;
    }
    const angle = (rad1: number, rad2: number): number => {
        let angle = Math.abs(rad1 - rad2) % (2 * Math.PI);
        return angle > Math.PI ? 2 * Math.PI - angle : angle;
    }
    function signedAngle(rad1: number, rad2: number): number {
        let angle = (rad2 - rad1) % (2 * Math.PI);
        if (angle > Math.PI) angle -= 2 * Math.PI;
        if (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
    function AngleTo(rot: number): number {
        const closestRot = reset ? 0 : (angle(rot, Math.PI * 2) > Math.PI / 2 ? Math.PI : 0)
        const angleTo = signedAngle(rot, closestRot)
        // console.log(closestRot, angle(rot, Math.PI * 2) % Math.PI / 2, rot)
        return angleTo
    }
    useTick((delta) => {
        let rot = rotation;
        let vel = rotationalVelocity;
        if (grabbing) {
            const offset = new Vector2(width / 2, height / 2)
            offset.subtract(mousePosition)
            const point = offset.normalized()
            const angled = leftSide ? Vector2.LEFT : Vector2.RIGHT
            angled.rotateAround(Vector2.ZERO, rot)
            const angleDiff = angled.angleTo(point)
            rot -= angleDiff
            rot = (Math.abs(rot) % (Math.PI * 2)) * Math.sign(rot)
            // const angleTo = AngleTo(rot)


            vel = -angleDiff
        }
        else {
            rot += rotationalVelocity * delta
            rot = (Math.abs(rot) % (Math.PI * 2)) * Math.sign(rot)
            const angleTo = AngleTo(rot)

            vel = (rotationalVelocity + ((angleTo * Math.exp(-delta)) / 4)) * Math.exp(-delta / 10)
            vel = Math.min(Math.abs(vel), 1) * Math.sign(vel)
            if (Math.abs(angleTo) < 0.01 && Math.abs(rotationalVelocity) < 0.001) vel = 0
        }
        setRotationalVelocity(vel)
        setRotation(rot)
    })
    return (
        <>
            <Graphics
                draw={drawRect}
                pivot={[rectWidth / 2, 35 / 2]}
                eventMode={'dynamic'} rotation={rotation}
                x={width / 2}
                y={height / 2}
                onpointerenter={() => setHovering(true)}
                onpointerleave={() => setHovering(false)}
                onpointerdown={() => {
                    setLeftSide(getLeftSide())
                    setGrabbing(true)
                }}
            />
            {
                fontLoaded &&
                renderLetters()
            }
        </>
    )
}
function SingleLetter({ char, position, color }: { char: string, index: number, position: Vector2, color: Color }) {
    return (
        <>
            <Container x={position.x} y={position.y}>
                {/* <Graphics draw={
                    (g) => {
                        g.clear();
                        g.beginFill("red")
                        g.drawCircle(0, 0, 5)
                        g.endFill();
                    }
                } /> */}
                <BitmapText text={char} anchor={[0.5, 0.6]} align='center' fontSize={35} style={{ fontName: 'Chewy', align: 'center', tint: color }} />
            </Container>
        </>
    )
}