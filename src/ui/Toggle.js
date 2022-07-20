import React from 'react'

function Toggle({ children, checked = false, onChange = () => {} }) {
  return  <label className="relative flex items-center group p-1 text-md">
    <input
      type="checkbox"
      className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
      defaultChecked={checked}
    />
    <span
      className="w-10 h-6 flex items-center flex-shrink-0 mr-2 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-1"
    />
    {children}
  </label>
}

export default Toggle;
