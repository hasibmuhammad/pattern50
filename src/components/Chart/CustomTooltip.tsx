const CustomTooltip = ({ activeItem, ...props }) => {
  const { active, payload } = props;

  console.log(activeItem);
  if (active && payload && payload.length) {
    return (
      <>
        {activeItem === "firstBar" && (
          <div className="bg-white shadow-md rounded-md p-2">
            <div className="flex items-center mb-1">
              {/* Dynamic color box */}
              <div
                className="w-[10px] h-[10px] mr-2"
                style={{ backgroundColor: payload[0].fill }}
              ></div>
              {/* Data label and value */}
              <span className="text-gray-700">
                {payload[0].dataKey}:{" "}
                {payload[0].value >= 1000
                  ? `${(payload[0].value / 1000).toFixed(2)}k`
                  : payload[0].value}
              </span>
            </div>
          </div>
        )}

        {activeItem === "secondBar" && (
          <div className="bg-white shadow-md rounded-md p-2">
            <div className="flex items-center mb-1">
              {/* Dynamic color box */}
              <div
                className="w-[10px] h-[10px] mr-2"
                style={{ backgroundColor: payload[1].fill }}
              ></div>
              {/* Data label and value */}
              <span className="text-gray-700">
                {payload[1].dataKey}:{" "}
                {payload[1].value >= 1000
                  ? `${(payload[1].value / 1000).toFixed(2)}k`
                  : payload[1].value}
              </span>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export default CustomTooltip;
