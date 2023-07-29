import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import Image from 'next/image';
import { Fragment, useCallback, useMemo, useState } from 'react';

const SignInModal = ({ showSignInModal, setShowSignInModal }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState({});
  const [logged, setLogged] = useState(true);
  const [messages, setMessages] = useState([]);

  // show errors for the user
  const addMessage = (text, type) => {
    setMessages(() => [{ text, type }]);
  };

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        'https://fastapi-lgg5.onrender.com/auth/users/tokens',
        new URLSearchParams(credentials).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const toggleMode = () => {
    setLogged((prev) => !prev);
  };

  const registerUser = async (credentials) => {
    try {
      const response = await axios.post(
        'https://fastapi-lgg5.onrender.com/auth/users',
        credentials,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (logged) {
      try {
        const token = await loginUser({ username: userName, password: password });
        localStorage.setItem('token', token.access_token);
        setToken(token);

        if (token) {
          addMessage('Logged in successfully!', 'success');
          window.location.reload();
        } else {
          addMessage('Login failed.', 'error');
        }
      } catch (error) {
        addMessage('Check your credentials', 'error');
      }
    } else {
      try {
        const token = await registerUser({ email: userName, password: password });
        addMessage('Registered successfully!', 'success');
        setToken(token);
        localStorage.setItem('token', token.access_token);
        setLogged(true);
        window.location.reload();
      } catch (error) {
        addMessage('Check your credentials', 'error');
      }
    }
  };

  return (
    <Transition appear show={showSignInModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40"
        open={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200 transition-all sm:m-8 rounded-md md:p-8">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
                  <Image
                    src="/sherlock-holmes-icon.png"
                    alt="Logo"
                    className="h-10 w-10 rounded-full"
                    width={20}
                    height={20}
                  />
                  <h3 className="font-display text-2xl font-bold">Sign {logged ? 'In' : 'Up'}</h3>
                </div>
                 {/*fields*/}
                <form onSubmit={handleSubmit} className="bg-white px-4 py-6 space-y-4">
                  <input
                    type="email"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {/*log in and register buttons*/}
                  <div className="flex justify-center items-center">
                    <button type="submit" className="inline-flex rounded-md items-center justify-center">
                      <span className="h-10 flex items-center justify-center uppercase font-semibold px-8 bg-gray-300 text-gray-800 rounded-md border border-black hover:bg-black hover:text-white transition duration-500 ease-in-out">
                        {logged ? 'Log In' : 'Register'}
                      </span>
                    </button>
                  </div>
                   {/*links for redirection*/}
                  <p className="text-sm">
                    {logged
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button type="button" className="text-blue-500 ml-1" onClick={toggleMode}>
                      {logged ? 'Register' : 'Log In'}
                    </button>
                  </p>
                   {/*message errors for the user*/}
                  {messages.map((message, index) => (
                    <p
                      key={index}
                      className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {message.text}
                    </p>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(() => ({ setShowSignInModal, SignInModal: SignInModalCallback }), [
    setShowSignInModal,
    SignInModalCallback,
  ]);
}
