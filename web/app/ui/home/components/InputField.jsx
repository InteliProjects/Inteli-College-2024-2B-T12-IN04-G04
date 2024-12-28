import React from "react";

const InputField = ({ label, name, value, onChange }) => {
  const handleChange = (e) => {
    console.log(`Changing ${name} to:`, e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="text-[16px] mr-[24px]">
      <p>{label}</p>
      <input
        name={name}
        type="number"
        value={value}
        onChange={handleChange}
        className="p-[16px] w-[180px] h-[40px] rounded-[10px] text-black"
      />
    </div>
  );
};

export default InputField;