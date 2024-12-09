import { useRef } from "react";
import NavBar from "./componentes/Navbar";
import SqlEditor from "./componentes/SqlEditor";
import TableVisualizer from "./componentes/TableVisualizer";
import { Provider } from "./context/Provider";

export default function App() {
  const visualizerRef = useRef<HTMLDivElement>(null);

  return (
    <Provider>
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <NavBar targetRef={visualizerRef} />
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/4 border-r border-gray-700">
            <SqlEditor />
          </div>
          <div
            className="flex-grow relative overflow-hidden"
            ref={visualizerRef}
          >
            <TableVisualizer />
          </div>
        </div>
      </div>
    </Provider>
  );
}
