const RefreshButton = () => {
  function RefreshHandler() {
    window.location.reload();
  }

  return (
    <span className="mx-2 text-info">
      <button
        className="btn btn-primary btn-sm shadow text-primary "
        title="Refresh"
        onClick={() => RefreshHandler()}
      >
        <i className="fa fa-refresh"></i> Refresh Page
      </button>
    </span>
  );
};

export default RefreshButton;
