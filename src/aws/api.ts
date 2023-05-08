import {
  EC2Client,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  RebootInstancesCommand,
} from "@aws-sdk/client-ec2";

if (!process.env.AWS_ACCESS_KEY) throw new Error("Please add a AWS access key");
if (!process.env.AWS_SECRET_KEY) throw new Error("Please add a AWS secret key");

const ec2Client = new EC2Client({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const getInstInfo = async (options = {}) => {
  try {
    console.log("Getting information on instance(s)");
    const { Reservations } = await ec2Client.send(
      new DescribeInstancesCommand(options)
    );
    console.log("Success", JSON.stringify(Reservations));
    return Reservations;
  } catch (err: any) {
    console.log("Error", err);
    return err["Code"];
  }
};

export const startEBSInst = async (options: any) => {
  try {
    console.log("Starting EBS EC2 Instance");
    const data = await ec2Client.send(new StartInstancesCommand(options));
    console.log("Success", JSON.stringify(data));
    return data;
  } catch (err: any) {
    console.log("Error", err);
    return err["Code"];
  }
};

export const stopEBSInst = async (options: any) => {
  try {
    console.log("Stopping EBS EC2 instance(s)");
    const data = await ec2Client.send(new StopInstancesCommand(options));
    console.log("Success", JSON.stringify(data));
    return data;
  } catch (err: any) {
    console.log("Error", err);
    return err["Code"];
  }
};

export const rebootInst = async (options: any) => {
  try {
    console.log("Rebooting instance");
    const data = await ec2Client.send(new RebootInstancesCommand(options));
    console.log("Success", JSON.stringify(data));
    return data;
  } catch (err: any) {
    console.log("Error", err);
    return err["Code"];
  }
};
