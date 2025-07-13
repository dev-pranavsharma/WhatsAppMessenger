import React, { useState } from 'react';

const Stepper = ({ steps,value,setvalue }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const goPrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const StepComponent = steps[currentStep];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stepper Header */}

      {/* Step Content */}
      <div className="mb-6">
     { StepComponent&&<StepComponent value={value} setvalue={setvalue} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button onClick={goPrevious} disabled={currentStep === 0} className="btn btn-secondary" >
          Previous
        </button>
              <div className="flex justify-center items-center gap-4">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition duration-200
              ${index === currentStep
                ? 'bg-primary-100 text-primary-500'
                : 'bg-gray-200 text-gray-600 hover:bg-primary-100'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
        <button
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default React.memo(Stepper);