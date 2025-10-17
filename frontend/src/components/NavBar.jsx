const NavBar = () => {
  return (
    <nav className="w-full bg-base text-base-content px-4 py-10 flex items-center justify-between relative">
      {/* Empty div to balance the center */}
      <div className="flex-1"></div>

      {/* Centered title */}
      <h1 className="text-2xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
        typr.io
      </h1>
    </nav>
  );
};

export default NavBar;
