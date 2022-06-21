function App() {
  return (
    <div className="flex flex-col h-full w-full max-h-screen">
      <div className="flex flex-col sm:flex-row h-full overflow-scroll">
        <div className="basis-1/2 relative">
          Test
        </div>
        <div className="basis-1/2 border-l-8 max-h-full overflow-scroll">
          Test
        </div>
      </div>
    </div>
  );
}

export default App;
