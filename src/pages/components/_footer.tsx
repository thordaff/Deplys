import Link from 'next/link';

const Navbar = () => {
    return (
      <nav>
        <div className="m-5">
            <div className="flex flex-row">
                <div className="nav-item Logo">
                    <h1 className="text-2xl font-bold">Depression Analysis</h1>
                </div>
            </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;