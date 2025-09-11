"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Sparkles,
  Heart,
  Lightbulb,
  CheckCircle,
  GraduationCap,
  Star,
  ThumbsUp,
  User,
  MessageCircle,
} from "lucide-react";

const icons = [
  {
    Icon: GraduationCap,
    pos: "top-20 left-1/4",
    rotate: 360,
    color: "text-secondary",
  },
  { Icon: Heart, pos: "top-1/3 right-1/4", rotate: -360, color: "text-danger" },
  {
    Icon: Lightbulb,
    pos: "bottom-1/4 left-1/3",
    rotate: 360,
    color: "text-warning",
  },
  {
    Icon: CheckCircle,
    pos: "bottom-20 right-1/3",
    rotate: -360,
    color: "text-success",
  },
  {
    Icon: Sparkles,
    pos: "top-1/2 right-10",
    rotate: 360,
    color: "text-warning",
  },
  {
    Icon: Star,
    pos: "top-10 right-1/3",
    rotate: -360,
    color: "text-warning",
  },
  {
    Icon: ThumbsUp,
    pos: "bottom-1/3 left-20",
    rotate: 360,
    color: "text-primary",
  },
  {
    Icon: User,
    pos: "top-1/4 left-10",
    rotate: -360,
    color: "text-danger",
  },
  {
    Icon: MessageCircle,
    pos: "bottom-10 right-1/4",
    rotate: 360,
    color: "text-info",
  },
];

export default function UIIndex() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-full h-full p-2 gap-2 overflow-hidden">
        <div className="absolute flex items-center justify-center w-[800px] h-[800px] border-1 border-default rounded-full" />
        <div className="absolute flex items-center justify-center w-[1000px] h-[1000px] border-1 border-default rounded-full" />
        <div className="absolute flex items-center justify-center w-[1200px] h-[1200px] border-1 border-default rounded-full" />
        <div className="absolute flex items-center justify-center w-[1400px] h-[1400px] border-1 border-default rounded-full" />
        <div className="absolute flex items-center justify-center w-[1600px] h-[1600px] border-1 border-default rounded-full" />
        <div className="absolute flex items-center justify-center w-[1800px] h-[1800px] border-1 border-default rounded-full" />

        {icons.map(({ Icon, pos, rotate, color }, i) => (
          <motion.div
            key={i}
            className={`absolute ${pos} lg:flex hidden items-center justify-center p-2 rounded-full`}
            animate={{ rotate }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Icon className={`w-8 h-8 ${color}`} />
          </motion.div>
        ))}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-2 gap-2">
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-center text-3xl font-semibold">
            Powering Industrial Connectivity
          </div>
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-center text-sm">
            <strong>CHH Industry API</strong> — Connect, control, and manage
            your factory data for smarter production and warehouse operations.
          </div>
          <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center h-fit p-2 gap-2">
              <Button color="primary" radius="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 flex items-center justify-center w-full h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-center text-lg font-semibold">
            Unifying industrial processes in one platform.
          </div>
        </div>
      </div>
    </>
  );
}
