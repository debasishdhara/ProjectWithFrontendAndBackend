import Header from '../inner/header';
import Footer from '../inner/footer';

const UserLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

export default UserLayout;
