import { Editor, TLGeoShape, TLShape, TLTextShape } from "tldraw";

export function getCanvasText(editor: Editor, shapes: TLShape[]) {
  const texts = Array.from(shapes)
    .filter((shape) => {
      return shape.type === "text" || shape.type === "geo" || shape.type === "arrow" || shape.type === "note";
    })
    .sort((a, b) => {
      // top first, then left, based on page position
      const pageBoundsA = editor.getShapePageBounds(a)!;
      const pageBoundsB = editor.getShapePageBounds(b)!;

      return pageBoundsA.y === pageBoundsB.y
        ? pageBoundsA.x < pageBoundsB.x
          ? -1
          : 1
        : pageBoundsA.y < pageBoundsB.y
        ? -1
        : 1;
    })
    .map((shape) => {
      if (!shape) return null;
      const text = (shape as TLTextShape | TLGeoShape).props.text ?? null;
      if ((shape as TLTextShape | TLGeoShape).props.color === "red") {
        return `Annotation: ${text}`;
      }
      return text;
    })
    .filter((v) => !!v);

  return texts.join("\n");
}
