const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="admin-layout bg-dark text-white p-4" style={{ minHeight: '100vh' }}>
      <h1 className="mb-4">Admin Panel</h1>
      {children}
    </div>
  );
  
  export default AdminLayout;
  