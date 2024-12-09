import { Database, Save, FileUp, FileDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTableModal from "./CreateTableModal";
import { toPng } from "html-to-image";
import Spinner from "@/components/ui/spinner";
import { useState } from "react";
import { useModalHook } from "@/hooks/useModalHook";
import FileUploadModal from "./FileUploadModal";
const Navbar = ({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLDivElement>;
}) => {
  const { isOpen, onClose, onOpen } = useModalHook();
  const {
    isOpen: isOpenUploadModal,
    onClose: onCloseUploadModal,
    onOpen: onOpenUploadModal,
  } = useModalHook();
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsLoadingImage(true);
    if (targetRef.current) {
      try {
        const dataUrl = await toPng(targetRef.current as HTMLDivElement);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "div-image.png";
        link.click();
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      }
    }
    setIsLoadingImage(false);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Database className="w-6 h-6" size={24} />
        <h1 className=" ml-2 text-xl font-bold">DB Visual Editor</h1>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="lg"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={handleDownload}
          disabled={isLoadingImage}
        >
          {isLoadingImage ? <Spinner /> : <Save className="w-4 h-4 mr-2" />}
          Save Screenshot Schema
        </Button>
        <Button variant="secondary" size="lg" onClick={onOpenUploadModal}>
          <FileUp className="w-4 h-4 mr-2" /> Import SQL
        </Button>
        <Button variant="secondary" size="lg">
          <FileDown className="w-4 h-4 mr-2" /> Export to SQL
        </Button>
        <Button
          variant="default"
          size="lg"
          className="bg-green-500 hover:bg-green-600"
          onClick={onOpen}
        >
          <Plus className="w-4 h-4 mr-2" /> New Table
        </Button>
        {isOpen && <CreateTableModal isOpen={isOpen} onClose={onClose} />}
        {isOpenUploadModal && (
          <FileUploadModal
            isOpen={isOpenUploadModal}
            onClose={onCloseUploadModal}
          />
        )}
      </div>
    </nav>
  );
};
export default Navbar;
