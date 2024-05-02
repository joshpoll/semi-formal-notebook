"use client";
import { Dispatch, Fragment, SetStateAction, createContext, useCallback, useState } from "react";
import { Tldraw } from "tldraw";
import { CellDivider } from "./CellDivider";
import { Cell } from "./Cell";
import { CellOutputCode } from "./CellOutputCode";

import dynamic from "next/dynamic";
import { JupyterCell } from "../JupyterCell";

const JupyterCellNoSSR = dynamic(() => import("../JupyterCell"), { ssr: false });
const JupyterNotebookNoSSR = dynamic(() => import("../JupyterNotebook"), { ssr: false });

type Notebook = Array<{
  id: string;
  title: string;
  content: string;
}>;

export const focusedEditorContext = createContext(
  {} as {
    focusedEditor: string | null;
    setFocusedEditor: (id: string | null) => void;
  }
);

export type CellType = "data" | "computed" | "function" | "view";

export type CellStateEntry = {
  name: string;
  type: CellType;
  data: string;
  view: string;
};

export type CellState = { [id: string]: CellStateEntry };

export const cellStateContext = createContext<[CellState, Dispatch<SetStateAction<CellState>>]>([{}, () => {}]);

export default function Home() {
  const [cellState, setCellState] = useState<CellState>({});

  const [focusedEditor, _setFocusedEditor] = useState<string | null>("A");

  const setFocusedEditor = useCallback(
    (id: string | null) => {
      if (focusedEditor !== id) {
        _setFocusedEditor(id);
      }
    },
    [focusedEditor]
  );

  const [notebook, setNotebook] = useState<Notebook>([
    {
      id: "1",
      title: "Hello World",
      content: "This is a notebook",
    },
    // {
    //   id: "2",
    //   title: "Hello World 2",
    //   content: "This is a notebook 2",
    // },
  ]);

  const addCell = (index: number | null) => () => {
    // insert entry after index unless index is null, then insert at the beginning
    const newCell = {
      id: Math.random().toString(36).substring(2, 15),
      title: `New Cell ${index === null ? "(first)" : index + 1}`,
      content: "",
    };
    if (index === null) {
      setNotebook((notebook) => [newCell, ...notebook]);
    } else {
      setNotebook((notebook) => [...notebook.slice(0, index + 1), newCell, ...notebook.slice(index + 1)]);
    }
  };

  return (
    <div className="space-y-8 py-12" onPointerDown={() => setFocusedEditor(null)}>
      {/* <JupyterCellNoSSR />
      <JupyterCellNoSSR /> */}
      {/* <JupyterNotebookNoSSR /> */}
      <cellStateContext.Provider value={[cellState, setCellState]}>
        <focusedEditorContext.Provider value={{ focusedEditor, setFocusedEditor }}>
          <div className="flex justify-center">
            <CellDivider onAddCell={addCell(null)} />
          </div>
          {notebook.map((cell, i) => (
            <Fragment key={cell.id}>
              <div className="flex justify-center">
                <CellOutputCode pos={i} />
              </div>
              <div className="flex justify-center">
                <CellDivider onAddCell={addCell(i)} />
              </div>
            </Fragment>
          ))}
        </focusedEditorContext.Provider>
      </cellStateContext.Provider>
    </div>
  );
}
