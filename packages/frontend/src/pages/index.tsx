import { NextPage } from 'next';
import classNames from 'classnames';

const Home: NextPage = () => {
  return (
    <main
      className={classNames(
        'h-full',
        'w-full',
        'flex',
        'items-center, justify-center',
      )}
    >
      Welcome to the SSG test task
    </main>
  );
};

export default Home;
