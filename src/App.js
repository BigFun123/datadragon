import logo from './logo.svg';
import './App.css';
import Graph3D from './components/graph/graph';
import { BookContext, BookContextProvider } from './controllers/context';
import DataLoader from './components/dataloader/dataloader';
import DataProcessor from './components/dataprocessor/dataprocessor';
import DataView from './components/dataview/dataview';

function App() {
  return (
    <div className="App">      
      <BookContextProvider>
      <div className='header'>Book Dragon</div>
        <div className="hcontainer">
          <div className="vcontainer">
          <Graph3D></Graph3D>
          <DataProcessor></DataProcessor>
          <DataLoader></DataLoader>
          </div>
          <DataView></DataView>          
        </div>
        
        
      </BookContextProvider>
    </div>
  );
}

export default App;
