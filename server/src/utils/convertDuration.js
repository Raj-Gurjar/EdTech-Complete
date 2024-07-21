// utils.js
const convertSecondsToDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
};

const calculateTotalDuration = (courseContent) => {
    let totalDurationInSeconds = 0;

    courseContent?.forEach((content) => {
        content.subSections?.forEach((subSection) => {
            let timeDurationInSeconds = parseInt(subSection.timeDuration, 10);
            if (isNaN(timeDurationInSeconds)) {
                timeDurationInSeconds = 0;
            }
            totalDurationInSeconds += timeDurationInSeconds;
        });
    });

    return convertSecondsToDuration(totalDurationInSeconds);
};

module.exports = { calculateTotalDuration, convertSecondsToDuration };
