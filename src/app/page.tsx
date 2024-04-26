"use client";
import { Fragment, createContext, useCallback, useState } from "react";
import { Tldraw } from "tldraw";
import { CellDivider } from "./CellDivider";
import { Cell } from "./Cell";
import { CellOutputCode } from "./CellOutputCode";

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

export default function Home() {
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
    {
      id: "2",
      title: "Hello World 2",
      content: "This is a notebook 2",
    },
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
      <focusedEditorContext.Provider value={{ focusedEditor, setFocusedEditor }}>
        <div className="flex justify-center">
          <CellDivider onAddCell={addCell(null)} />
        </div>
        <div className="flex justify-center">
          <CellOutputCode {...notebook[0]} />
        </div>
        <div className="flex justify-center">
          <CellDivider onAddCell={addCell(null)} />
        </div>
        {notebook.map((cell, i) => (
          <Fragment key={cell.id}>
            <div className="flex justify-center">
              <Cell {...cell} />
            </div>
            <div className="flex justify-center">
              <CellDivider onAddCell={addCell(i)} />
            </div>
          </Fragment>
        ))}
      </focusedEditorContext.Provider>
    </div>
  );
}
