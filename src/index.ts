import { v4 as uuidv4 } from "uuid";

const fs = require("fs");

type WorkerInterval = {
  start: Date;
  end: Date;
};

type Worker = {
  workerId: number;
  intervals: WorkerInterval[];
};

const getWorkers = (inputFilePath: string): Worker[] => {
  const data = fs.readFileSync(inputFilePath, "utf8");

  return data.split("\n").map((rawWorker: string) => {
    const workerParts = rawWorker.replace(/[\[\]']+/g, "").split("@");

    const workerId = workerParts[0];
    const rawIntervals = workerParts[1] ? workerParts[1].split(",") : [];

    return {
      workerId,
      intervals: rawIntervals.map((interval: string) => {
        const intervalParts = interval.split("/");
        return {
          start: new Date(intervalParts[0]),
          end: new Date(intervalParts[1]),
        };
      }),
    };
  });
};

export async function solveFirstQuestion(
  inputFilePath: string
): Promise<string> {
  const workers = getWorkers(inputFilePath);
  const startIntervalsInMilliSeconds = workers.flatMap((worker) =>
    worker.intervals.map((interval) => interval.start.getTime())
  );
  const earliestStartInterval = startIntervalsInMilliSeconds.sort()[0];
  return new Date(earliestStartInterval).toISOString();
}

export async function solveSecondQuestion(
  inputFilePath: string
): Promise<string> {
  const workers = getWorkers(inputFilePath);
  const endIntervalsInMilliSeconds = workers.flatMap((worker) =>
    worker.intervals.map((interval) => interval.end.getTime())
  );
  const latestEndInterval =
    endIntervalsInMilliSeconds.sort()[endIntervalsInMilliSeconds.length - 1];
  return new Date(latestEndInterval).toISOString();
}

export async function solveThirdQuestion(
  inputFilePath: string
): Promise<string[]> {
  const workers = getWorkers(inputFilePath);
  questionThreeSolutionOne(workers);

  return [];
}

type IntervalCount = {
  intervalCompoundKey: string;
  intervalCount: number;
};

const questionThreeSolutionOne = (workers: Worker[]): [] => {
  console.log(workers);

  // keep track of the unique intervals over a list of workers
  const intervalCounts: IntervalCount[] = [];

  workers.forEach((worker) => {
    worker.intervals.forEach((interval) => {
      const startTimeMilliseconds = interval.start.getTime();
      const endTimeMilliseconds = interval.start.getTime();
      const intervalCompoundKey = `${startTimeMilliseconds}-${endTimeMilliseconds}`;

      const intervalCount = intervalCounts.find(
        (intervalCount) =>
          intervalCount.intervalCompoundKey === intervalCompoundKey
      );

      if (intervalCount) {
        intervalCount.intervalCount++;
      } else {
        intervalCounts.push({
          intervalCompoundKey,
          intervalCount: 1,
        });
      }
    });
  });

  const intervalsWithTwoOrMoreWorkers = intervalCounts.filter(
    (intervalCount) => intervalCount.intervalCount > 1
  );

  console.log({ intervalsWithTwoOrMoreWorkers });

  return [];
};
