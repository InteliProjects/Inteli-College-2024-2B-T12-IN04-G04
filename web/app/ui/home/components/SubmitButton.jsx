import React from 'react';

const SubmitButton = ({ maximum_distance, operating_time, prensaId }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const maxDistanceNum = Number(maximum_distance);
    const operatingTimeNum = Number(operating_time);
    const prensaIdNum = Number(prensaId);

    console.log("Submitting with values:", { maxDistanceNum, operatingTimeNum, prensaIdNum });
    try {
      const response = await fetch('/api/updatePrensas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maximum_distance: maxDistanceNum,
          operating_time: operatingTimeNum,
          prensaId: prensaIdNum,
        }),
      });

      if (response.ok) {
        console.log('Prensa updated successfully');
      } else {
        const contentType = response.headers.get('content-type');
        console.log('Response content-type:', contentType);
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const errorData = await response.json();
          console.error('Failed to update Prensa:', errorData);
        } else {
          console.error('Failed to update Prensa: Non-JSON response');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <button
      className="text-black font-semibold w-[70px] h-[18px] rounded-[4px] bg-white"
      onClick={handleSubmit}
    >
      Submit
    </button>
  );
};

export default SubmitButton;