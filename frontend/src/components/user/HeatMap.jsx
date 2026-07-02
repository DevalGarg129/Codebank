import React, { useMemo } from "react";

const HeatMapProfile = () => {
  const activityData = useMemo(() => {
    return Array.from({ length: 35 }, (_, index) => ({
      id: index,
      intensity: index % 5 === 0 ? 4 : index % 3 === 0 ? 2 : 1,
    }));
  }, []);

  const getColor = (intensity) => {
    const palette = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
    return palette[intensity] || palette[0];
  };

  return (
    <div>
      <h4>Recent Contributions</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 16px)", gap: "4px", marginTop: "0.75rem" }}>
        {activityData.map((item) => (
          <div
            key={item.id}
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: getColor(item.intensity),
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeatMapProfile;