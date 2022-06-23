function App() {
  return (
    <div className="flex flex-col h-full w-full max-h-screen">
      <div className="flex flex-col sm:flex-row h-full overflow-scroll">
        <div className="basis-3/5 relative">
          Map
        </div>
        <div className="basis-2/5 border-l-8 max-h-full overflow-scroll">
          List/Detail
        </div>
      </div>
    </div>
  );
}

export default App;
