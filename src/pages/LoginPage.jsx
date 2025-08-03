import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FloatingLabelInput } from '../components/ui/floating-label-input';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/app-selection');
    }
  };

  const handleSSO = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/app-selection');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Full SVG Background from Login.svg */}
      <div className="absolute inset-0 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 1728 1117" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <g clipPath="url(#clip0_1_2)">
            <rect width="1728" height="1117" fill="url(#paint0_linear_1_2)"/>
            <path d="M242.287 1167L426.2 983.087H377.311L193.399 1167H242.287Z" fill="black" fillOpacity="0.12"/>
            <path d="M327.258 1167L511.171 983.087H462.283L278.37 1167H327.258Z" fill="black" fillOpacity="0.12"/>
            <path d="M412.234 1167L596.146 983.087H547.258L363.345 1167H412.234Z" fill="black" fillOpacity="0.12"/>
            <path d="M497.207 1167L681.12 983.087H632.231L448.319 1167H497.207Z" fill="black" fillOpacity="0.12"/>
            <path d="M582.177 1167L766.09 983.087H717.201L533.289 1167H582.177Z" fill="black" fillOpacity="0.12"/>
            <path d="M667.148 1167L851.061 983.087H802.173L618.26 1167H667.148Z" fill="black" fillOpacity="0.12"/>
            <path d="M752.122 1167L936.034 983.087H887.146L703.233 1167H752.122Z" fill="black" fillOpacity="0.12"/>
            <path d="M-148.22 1167L35.693 983.087H-13.1951L-197.108 1167H-148.22Z" fill="black" fillOpacity="0.12"/>
            <path d="M-63.2463 1167L120.666 983.087H71.7782L-112.134 1167H-63.2463Z" fill="black" fillOpacity="0.12"/>
            <path d="M1356.84 435.974C1378.22 435.974 1388.92 461.825 1373.81 476.944L989.304 861.446C984.803 865.947 978.699 868.476 972.333 868.476H416.906C395.524 868.476 384.816 842.624 399.935 827.505L784.437 443.003C788.938 438.502 795.043 435.974 801.408 435.974H1356.84ZM1373.81 344.12C1388.93 359.239 1378.22 385.091 1356.84 385.091H801.409C795.044 385.091 788.939 382.562 784.438 378.061L399.936 -6.4406C384.817 -21.5598 395.525 -47.4111 416.907 -47.4111H972.334C978.699 -47.4111 984.804 -44.8826 989.305 -40.3817L1373.81 344.12Z" fill="black" fillOpacity="0.12"/>
            <path d="M1682.41 84.6666L1478.71 -118.333C1473.66 -123.369 1477.23 -132 1484.36 -132H1561.95L1727.65 33.1258C1729.15 34.6269 1730 36.6659 1730 38.7924V79C1730 83.4183 1726.42 87 1722 87H1688.06C1685.94 87 1683.91 86.1609 1682.41 84.6666Z" fill="black" fillOpacity="0.12"/>
            <path d="M1682.41 116.333L1478.71 319.333C1473.66 324.369 1477.23 333 1484.36 333H1561.95L1727.65 167.874C1729.15 166.373 1730 164.334 1730 162.208V122C1730 117.582 1726.42 114 1722 114H1688.06C1685.94 114 1683.91 114.839 1682.41 116.333Z" fill="black" fillOpacity="0.12"/>
            <path d="M484.072 419.525L438 499.985L484.072 585.042" stroke="url(#paint1_linear_1_2)" strokeWidth="0.853178"/>
            <path d="M1243.4 419.525L1289.47 499.985L1243.4 585.042" stroke="url(#paint2_linear_1_2)" strokeWidth="0.853178"/>
            <path d="M458.906 502.71L568.539 314.585H590.722V690.41H568.539L458.906 502.71Z" fill="url(#paint3_linear_1_2)"/>
            <path d="M1266.01 499.298L1155.95 311.599L1133.34 312.025V689.13H1155.52L1266.01 499.298Z" fill="url(#paint4_linear_1_2)"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="1728" y2="1117" gradientUnits="userSpaceOnUse">
              <stop stopColor="#362C66"/>
              <stop offset="1" stopColor="#4C5E9B"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="484" y1="420" x2="484" y2="585" gradientUnits="userSpaceOnUse">
              <stop stopColor="#13B5EA"/>
              <stop offset="1" stopColor="#CB55FF"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1_2" x1="1243.47" y1="420" x2="1243.47" y2="585" gradientUnits="userSpaceOnUse">
              <stop stopColor="#13B5EA"/>
              <stop offset="1" stopColor="#CB55FF"/>
            </linearGradient>
            <linearGradient id="paint3_linear_1_2" x1="459.332" y1="503.99" x2="591" y2="503.99" gradientUnits="userSpaceOnUse">
              <stop stopColor="#362C66"/>
              <stop offset="1" stopColor="#3E4A72" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="paint4_linear_1_2" x1="1265.58" y1="501.864" x2="1133" y2="500" gradientUnits="userSpaceOnUse">
              <stop stopColor="#362C66"/>
              <stop offset="1" stopColor="#3E4A72" stopOpacity="0"/>
            </linearGradient>
            <clipPath id="clip0_1_2">
              <rect width="1728" height="1117" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="w-full max-w-4xl px-8 relative z-10 flex items-center justify-center">
        {/* Center Content */}
        <div className="w-full max-w-md px-8">
          {/* Deltek Logo */}
          <div className="mb-8">
            <svg width="160" height="42" viewBox="0 0 160 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="delteklogosvgwhite">
                <path id="Vector" d="M152.167 8.00751H143.816C137.338 15.2591 131.543 22.8579 131.543 22.8579V22.8846H131.476V0.0614624H125.079V40.3927H131.476V25.5422H131.543C131.543 25.5422 137.352 33.1411 143.816 40.3927H152.167C144.672 31.9926 139.707 25.7826 138.449 24.2068C139.694 22.6309 144.672 16.421 152.167 8.02086V8.00751Z" fill="white"/>
                <path id="Vector_2" d="M23.3212 23.2452C23.3212 32.126 18.851 34.8905 12.6275 34.8905H6.88585V5.63032H10.4593C19.4667 5.63032 23.3346 8.76868 23.3346 17.4626V23.2452H23.3212ZM30.147 20.4674C30.147 6.95244 26.0917 0.141541 10.9144 0.141541H0.274231V40.3926H12.855C27.3765 40.3926 30.147 33.328 30.147 20.4807" fill="white"/>
                <path id="Vector_3" d="M70.2985 0.0480957L63.7136 0.0614507L63.7404 0.0480957V40.3793H70.2851V0.0614507L70.2985 0.0480957Z" fill="white"/>
                <path id="Vector_4" d="M47.2515 13.8702C42.3531 13.8702 40.2919 18.0903 40.2919 22.2035H53.1137C53.1137 18.0369 52.2705 13.8702 47.2515 13.8702ZM59.1632 26.7174H40.3589V27.679C40.3589 31.7254 42.3664 35.7052 48.2286 35.7052C51.6816 35.7052 54.7599 34.797 57.4233 33.4749L57.7846 38.6699C55.4291 40.0454 51.802 40.9669 47.5594 40.9669C36.6114 40.9669 33.8945 34.57 33.8945 25.1549C33.8945 15.7399 37.6955 9.22278 47.4389 9.22278C54.693 9.22278 59.2836 13.0155 59.2836 23.2853C59.2836 23.953 59.1632 26.7308 59.1632 26.7308" fill="white"/>
                <path id="Vector_5" d="M86.6402 41.0203C81.1394 41.0203 78.7838 38.1223 78.8374 32.8072L78.8909 15.3125H73.9523V10.0107H78.8909L78.9444 2.34509H85.4222L85.3687 10.0107H93.225V15.3125H85.3687L85.3152 31.7789C85.3152 34.4364 86.3323 35.7051 88.7548 35.7051C90.6285 35.7051 92.8636 34.8638 92.8636 34.8638L93.225 39.6848C93.225 39.6848 90.2003 41.0203 86.6402 41.0203Z" fill="white"/>
                <path id="Vector_6" d="M108.897 14.0973C103.999 14.0973 101.938 18.3173 101.938 22.4306H114.746C114.746 18.2639 113.903 14.0973 108.884 14.0973M120.796 26.9445H101.991V27.906C101.991 31.9525 103.986 35.9322 109.848 35.9322C113.301 35.9322 116.379 35.0241 119.042 33.702L119.417 38.8969C117.062 40.2858 113.421 41.1806 109.192 41.1806C98.244 41.1806 95.527 34.7837 95.527 25.3686C95.527 15.9536 99.3281 9.43646 109.071 9.43646C116.326 9.43646 120.916 13.2426 120.916 23.499C120.916 24.1667 120.796 26.9445 120.796 26.9445Z" fill="white"/>
                <path id="Vector_7" d="M155.032 38.0155C155.032 36.7201 155.968 35.7719 157.253 35.7719C158.538 35.7719 159.448 36.7067 159.448 38.0021C159.448 39.2976 158.511 40.2591 157.24 40.2591C155.968 40.2591 155.032 39.3243 155.032 38.0289V38.0155ZM159.06 38.0021C159.06 36.9204 158.297 36.1191 157.24 36.1191C156.183 36.1191 155.433 36.8803 155.433 38.0021C155.433 39.1239 156.196 39.8852 157.253 39.8852C158.311 39.8852 159.06 39.1239 159.06 38.0021ZM157.628 38.9904L157.119 38.3227H156.852V38.937C156.852 39.0839 156.785 39.164 156.638 39.164H156.557C156.423 39.164 156.343 39.0572 156.343 38.8836V37.1074C156.343 36.9204 156.45 36.8269 156.611 36.8269H157.32C157.922 36.8269 158.244 37.0673 158.244 37.5614C158.244 37.9354 158.016 38.1891 157.615 38.2559L158.204 38.977C158.204 38.977 158.096 39.164 157.922 39.164C157.829 39.164 157.695 39.1106 157.601 38.977L157.628 38.9904ZM156.852 37.9354H157.32C157.601 37.9354 157.748 37.8018 157.748 37.5882C157.748 37.3478 157.588 37.2409 157.293 37.2409H156.838V37.9354H156.852Z" fill="white"/>
              </g>
            </svg>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <FloatingLabelInput
                id="username"
                type="text"
                label="Username / email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-variant"
              />

              <FloatingLabelInput
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-variant"
              />
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleLogin}
                size="sm"
                className="w-auto btn-white font-medium rounded px-8"
                disabled={!username.trim() || !password.trim()}
              >
                Login
              </Button>

              <Button 
                onClick={handleSSO}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent border border-white/30 text-white hover:bg-white/10 font-medium rounded whitespace-nowrap"
              >
                Use SSO: Single Sign-on
              </Button>
            </div>

            <div className="text-center">
              <button className="text-white/80 hover:text-white text-sm underline">
                Forgot password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
