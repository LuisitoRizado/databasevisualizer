import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/ui/spinner';
import { useCreateQuery } from '@/hooks/useCreateQuery';
import Editor from './Editor';

const SqlEditor = () => {
  const [sqlQuery, setSqlQuery] = useState<string>('CREATE TABLE Test;');

  const { isLoading, onCreateQuery } = useCreateQuery();

  const handleCreateQuery = async () => {
    await onCreateQuery(sqlQuery);
  };

  const generateQuery = (type: string) => {
    switch (type) {
      case 'CREATE':
        setSqlQuery('CREATE TABLE Test;');
        break;
      case 'UPDATE TABLE':
        setSqlQuery('UPDATE TABLE Test;');
        break;
      case 'DELETE TABLE':
        setSqlQuery('DELETE TABLE Test;');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-gray-800 p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2 text-white">SQL Editor</h2>
      <div className="flex space-x-2 mb-2">
        
      </div>
      <div className="flex-grow bg-gray-700 p-2 rounded-md font-mono text-sm overflow-auto">
        {isLoading ? (
          <Spinner />
        ) : (
          <Editor value={sqlQuery} onChange={setSqlQuery} />
        )}
      </div>
      <Button
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleCreateQuery}
      >
        Execute Query
      </Button>
    </div>
  );
};

export default SqlEditor;
