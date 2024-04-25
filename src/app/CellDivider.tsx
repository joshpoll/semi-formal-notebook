export type CellDividerProps = {
  onAddCell: () => void;
};

export const CellDivider = (props: CellDividerProps) => {
  return (
    // <div>
    //   <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg" onClick={props.onAddCell}>
    //     Add Cell
    //   </button>
    // </div>
    // add long horizontal dashed line with add cell button on top
    <div className="inline-flex items-center justify-center w-full opacity-30 hover:opacity-100 focus:opacity-100">
      <hr className="absolute w-5/12 border-dotted border-gray-600 border-1" />
      <button className="absolute bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow" onClick={props.onAddCell}>
        Add Cell
      </button>
    </div>
  );
};
