import { TLComponents, TLShape, TLUiOverrides, Tldraw, getSvgAsImage } from "tldraw";
import { addGridToSvg } from "./addGridToSvg";
import { useContext, useId, useState } from "react";
import { focusedEditorContext } from "./page";

export type CellProps = {
  id: string;
  title: string;
  content: string;
};

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const overrides: TLUiOverrides = {
  actions(editor, actions) {
    return {
      ...actions,
      screenshot: {
        id: "screenshot",
        label: "Screenshot",
        readonlyOk: true,
        kbd: "!r",
        async onSelect(source: any) {
          // const shapes = editor.store.allRecords().filter((r) => r.typeName === "shape");
          const shapes = editor.store.allRecords().filter((r) => r.typeName === "shape") as TLShape[];
          // // remove culled shapes from shapes array
          const visibleShapes = shapes.filter((shape) => !editor.getCulledShapes().has(shape.id));

          const svg = await editor.getSvgString(visibleShapes);
          if (!svg) {
            console.warn("Could not get the SVG.");
            return;
          }
          const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

          const blob = await getSvgAsImage(svg.svg, IS_SAFARI, {
            type: "png",
            quality: 1,
            scale: 1.1,
            width: svg.width,
            height: svg.height,
          });

          if (!blob) {
            console.warn("Could not get the blob.");
            return;
          }

          const base64img = await blobToBase64(blob);

          console.log(base64img);
        },
      },
    };
  },
};

const components: TLComponents = {
  DebugMenu: null,
  DebugPanel: null,
};

export const Cell = (props: CellProps) => {
  const { focusedEditor, setFocusedEditor } = useContext(focusedEditorContext);
  const id = useId();

  const [showCode, setShowCode] = useState(false);

  const [cellName, setCellName] = useState<string | null>(null);

  return (
    <div className="w-full h-full space-y-4 p-4">
      <div className="flex justify-center">Output</div>
      <div className="grid grid-cols-[1fr,1.5fr,1fr] w-full h-full gap-x-4 gap-y-2">
        <div className="flex justify-left col-start-2 col-span-2">
          <input
            className={`hover:border-blue-500 hover:border-solid hover:border-2 ${
              cellName ? "font-medium" : "font-normal"
            } ${cellName ? "" : "italic"}`}
            value={cellName ?? ""}
            placeholder="untitled"
            onChange={(e) => setCellName(e.target.value)}
          />
        </div>
        <div className="w-full h-full space-y-4 col-start-2">
          <div
            className="flex justify-center tldraw h-[36rem] hover:border-blue-500 hover:border-solid hover:border-2"
            onFocus={() => setFocusedEditor(id)}
          >
            <Tldraw overrides={overrides} className={id} autoFocus={focusedEditor === id} components={components} />
          </div>
        </div>
        <div className="space-y-4 overflow-auto">
          <button
            className="bg-indigo-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-indigo-300"
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? "Hide Code" : "Show Code"}
          </button>
          {showCode ? (
            <pre className="text-sm">{`import numpy as np

# The first function is for sampling t_i from a uniform distribution.
def stratified_sampling(t_n, t_f, N, i):
  return np.random.uniform(
    t_n + (i - 1)/N * (t_f - t_n),
    t_n + i/N * (t_f - t_n)
  )

# The second function is the quadrature rule used to estimate C(r).
def quadrature_rule(N, c, sigma):
  C_hat_r = 0
  for i in range(1, N+1):
    # delta_i is the distance between adjacent samples
    delta_i = sigma[i] - sigma[i-1] if i > 0 else sigma[i]
    T_i = np.exp(-np.sum(sigma[:i] * delta_i))
    C_hat_r += T_i * (1 - np.exp(-sigma[i] * delta_i)) * c[i-1]
  return C_hat_r
`}</pre>
          ) : null}
        </div>
      </div>
    </div>
  );
};
