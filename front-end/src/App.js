import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { TokenStats } from "./Stat";
const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <TokenStats />
      </div>
    </QueryClientProvider>
  );
}

export default App;