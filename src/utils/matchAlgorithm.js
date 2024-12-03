export const matchCandidateToJobs = (candidate, jobs) => {
    return jobs.map((job) => {
        const matchScore = calculateMatchScore(candidate, job);
        return { ...job, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);
};

const calculateMatchScore = (candidate, job) => {
    let score = 0;
    if (job.skills.some(skill => candidate.skills.includes(skill))) {
        score += 50; // Adjust scoring weights
    }
    if (candidate.location === job.location || job.location === "remote") {
        score += 30;
    }
    if (candidate.experience >= job.requiredExperience) {
        score += 20;
    }
    return score;
};
