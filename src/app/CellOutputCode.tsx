import { TLComponents, TLShape, TLUiOverrides, Tldraw, getSvgAsImage } from "tldraw";
import { addGridToSvg } from "./addGridToSvg";
import { useCallback, useContext, useId, useMemo, useState } from "react";
import { cellStateContext, focusedEditorContext } from "./page";
import JupyterCell from "@/JupyterCell";
import { getHtmlFromOpenAI } from "./getHtmlFromOpenAI";
import { getCanvasText } from "./getCanvasText";
import { EXAMPLE_RESPONSE, EXAMPLE_RESPONSE_2, EXAMPLE_RESPONSE_2B, EXAMPLE_RESPONSE_2C } from "./prompt";

export type CellProps = {
  pos: number;
  // id: string;
  // title: string;
  // content: string;
};

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const overrides = (
  setCode: (code: string) => void,
  setData: (data: any) => void,
  setDataValue: (data: any) => void,
  pos: number,
  cellState: CellState
): TLUiOverrides => ({
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

          // Send everything to OpenAI and get some HTML back
          try {
            // const json = await getHtmlFromOpenAI({
            //   image: base64img,
            //   apiKey: process.env.NEXT_PUBLIC_API_KEY!,
            //   text: getCanvasText(editor, shapes),
            //   // previousPreviews,
            //   // grid,
            //   theme: editor.user.getUserPreferences().isDarkMode ? "dark" : "light",
            // });

            // if (!json) {
            //   throw Error("Could not contact OpenAI.");
            // }

            // if (json?.error) {
            //   throw Error(`${json.error.message?.slice(0, 128)}...`);
            // }

            // // Extract the HTML from the response
            // const message = json.choices[0].message.content as string;
            // wait 1 second
            await new Promise((r) => setTimeout(r, 1000));
            const message = pos === 0 ? EXAMPLE_RESPONSE_2 : pos === 1 ? EXAMPLE_RESPONSE_2B : EXAMPLE_RESPONSE_2C;
            // cut data from ```json to the next occurrence of ```
            const dataPrefix = "function state() {";
            const start = message.indexOf(dataPrefix);
            const end = message.indexOf("```", start + dataPrefix.length);
            const data = message.slice(start + dataPrefix.length, end - "```".length + 1);

            // cut function from ```javascript to the next occurrence of ```
            const codePrefix = "function view(state, setState) {";
            const start2 = message.indexOf(codePrefix);
            const end2 = message.indexOf("```", start2 + codePrefix.length);
            const code = message.slice(start2 + codePrefix.length, end2 - "```".length - 1);

            console.log(message);
            // const start = message.indexOf("<!DOCTYPE html>");
            // const end = message.indexOf("</html>");
            // const html = message.slice(start, end + "</html>".length);

            // No HTML? Something went wrong
            if (code.length < 100) {
              console.warn(message);
              throw Error("Could not generate a design from those wireframes.");
            }

            // // Update the shape with the new props
            // editor.updateShape<PreviewShape>({
            //   id: newShapeId,
            //   type: "response",
            //   props: {
            //     html,
            //   },
            // });

            console.log(`Response: ${message}`);
            console.log(`Data Response: ${data}`);
            console.log(`Code Response: ${code}`);
            setData(data);
            setDataValue(new Function(data)());
            setCode(code);
          } catch (e) {
            // If anything went wrong, delete the shape.
            // editor.deleteShape(newShapeId);
            throw e;
          }
        },
      },
    };
  },
});

const components: TLComponents = {
  DebugMenu: null,
  DebugPanel: null,
};

export const CellOutputCode = (props: CellProps) => {
  const [cellState, setCellState] = useContext(cellStateContext);
  const { focusedEditor, setFocusedEditor } = useContext(focusedEditorContext);
  const id = useId();

  const [showViewOfCode, setShowViewOfCode] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showSFP, setShowSFP] = useState(true);

  // const [cellName, setCellName] = useState<string | null>("!CELL OUTPUT CODE!");
  const cellName = cellState[id]?.name;

  const setCellName = useCallback(
    (name: string) => {
      setCellState((state) => ({
        ...state,
        [id]: {
          ...state[id],
          name,
        },
      }));
    },
    [id, setCellState]
  );

  const data = cellState[id]?.data;

  const setData = useCallback(
    (data: any) => {
      setCellState((state) => ({
        ...state,
        [id]: {
          ...state[id],
          data,
        },
      }));
    },
    [id, setCellState]
  );

  const [dataValue, setDataValue] = useState<any>(undefined);

  const view = cellState[id]?.view;

  const setView = useCallback(
    (view: string) => {
      setCellState((state) => ({
        ...state,
        [id]: {
          ...state[id],
          view,
        },
      }));
    },
    [id, setCellState]
  );

  // const [code, setCode] = useState<string>(
  //   `return '<img src="https://www.cs.ubc.ca/~tmm/courses/547-20/tools/images/vega-lite_barchart.png"></img>'`
  // );

  // const [data, setData] = useState<any>(undefined);

  const appliedOverrides = useMemo(
    () => overrides(setView, setData, setDataValue, props.pos, cellState),
    [cellState, props.pos, setData, setView]
  );

  // changes when the code is updated
  const codeFunction = useMemo(() => {
    return new Function("state", "setState", view);
  }, [view]);

  // const cells = "";

  // changes when either the code is updated or the rest of the notebook is updated
  const output = useMemo(() => {
    return codeFunction(dataValue, setData);
  }, [codeFunction, dataValue, setData]);

  return (
    <div className="w-full h-full space-y-4 p-4">
      <div className="flex justify-center">
        <input
          className={`hover:border-blue-500 hover:border-solid hover:border-2 ${
            cellName ? "font-medium" : "font-normal"
          } ${cellName ? "" : "italic"}`}
          value={cellName ?? ""}
          placeholder="untitled"
          onChange={(e) => setCellName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-[1fr,1.5fr,1fr] w-full h-full gap-x-4 gap-y-2">
        {/* <div className="col-start-2">
          <textarea
            className="w-full h-full"
            rows={20}
            value={JSON.stringify(data)}
            onChange={(e) => setData(JSON.parse(e.target.value))}
          />
        </div> */}
        <div className="col-start-2" dangerouslySetInnerHTML={{ __html: output }} />
        <div className="col-start-2">
          <button
            className="bg-indigo-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-indigo-300"
            onClick={() => setShowViewOfCode(!showViewOfCode)}
          >
            {showViewOfCode ? "Hide ViewOf Code" : "Show ViewOf Code"}
          </button>
        </div>
        {showViewOfCode ? (
          <div className="flex justify-left col-start-2">
            {/* <div className={`${showCode ? "" : "invisible"} w-full h-full`}> */}
            {/* <JupyterCell /> */}
            <textarea className="w-full h-full" rows={20} value={view} onChange={(e) => setView(e.target.value)} />
          </div>
        ) : null}
        <div className="col-start-2">
          <button
            className="bg-indigo-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-indigo-300"
            onClick={() => setShowData(!showData)}
          >
            {showData ? "Hide Data/Code" : "Show Data/Code"}
          </button>
        </div>
        {showData ? (
          <div className="flex justify-left col-start-2">
            {/* <div className={`${showCode ? "" : "invisible"} w-full h-full`}> */}
            {/* <JupyterCell /> */}
            <textarea
              className="w-full h-full"
              rows={20}
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setDataValue(new Function(e.target.value)());
              }}
            />
          </div>
        ) : null}
        <div className="flex justify-right col-start-1">
          <button onClick={() => setShowSFP(!showSFP)}>{showSFP ? "Hide SFP" : "Show SFP"}</button>
        </div>
        <div className={`w-full h-full space-y-4 ${showSFP ? "" : "hidden"}`}>
          <div
            className="flex justify-center tldraw h-[36rem] hover:border-blue-500 hover:border-solid hover:border-2"
            onFocus={() => setFocusedEditor(id)}
          >
            <Tldraw
              overrides={appliedOverrides}
              className={id}
              autoFocus={focusedEditor === id}
              components={components}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
