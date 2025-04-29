import Hero from "../../components/user/landing/Hero";
import Main from "../../components/user/landing/Main";
// import Main from "../../components/user/landing/Main";
import Partners from "../../components/user/landing/PartnerUse";
import HowTo from "../../components/user/landing/HowTo";
import FAQ from "../../components/support/FAQ";
import Support from "../../components/user/landing/Support";

const UserHomepage = () => {
  return (
    <div>
      <Hero />
      <Partners/>
      <Main/>
      {/* <HowTo /> */}
      {/* <FAQ /> */}
      {/* <Support /> */}
    </div>
  );
};

export default UserHomepage;
