import React, { useState } from 'react';
import { Button } from '@components/ui/button';

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
        <Button variant='outline' onClick={goPrevious} disabled={currentStep === 0} className="btn btn-secondary" >
          Previous
        </Button>
              <div className="flex justify-center items-center gap-4">
        {steps.map((_, index) => (
          <Button
          variant={index === currentStep?'':'ghost'}
            key={index}
            onClick={() => goToStep(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center`}
          >
            {index + 1}
          </Button>
        ))}
      </div>
        <Button
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Stepper);