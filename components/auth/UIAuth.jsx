"use client";

import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
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
  { Icon: GraduationCap, color: "text-secondary" },
  { Icon: Heart, color: "text-danger" },
  { Icon: Lightbulb, color: "text-warning" },
  { Icon: CheckCircle, color: "text-success" },
  { Icon: Sparkles, color: "text-warning" },
  { Icon: Star, color: "text-warning" },
  { Icon: ThumbsUp, color: "text-primary" },
  { Icon: User, color: "text-danger" },
  { Icon: MessageCircle, color: "text-info" },
];

function OrbitIcon({ Icon, color, radius, angle, duration }) {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    const rad = (angle * Math.PI) / 180;
    setCoords({
      x: Math.round(Math.cos(rad) * radius * 800) / 1000,
      y: Math.round(Math.sin(rad) * radius * 800) / 1000,
    });
  }, [radius, angle]);
  if (!coords) return null;
  return (
    <motion.div
      className="absolute lg:flex hidden"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: `-${coords.x}px -${coords.y}px` }}
    >
      <div
        className="absolute flex items-center justify-center p-2 rounded-full"
        style={{ transform: `translate(${coords.x}px, ${coords.y}px)` }}
      >
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </motion.div>
  );
}

export default function UIAuth({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
}) {
  return (
    <div className="flex flex-row items-center justify-center w-full h-full gap-2">
      <div className="flex flex-col items-center justify-center w-full lg:w-4/12 h-full p-2 gap-2 bg-white border-r-1 border-default">
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-center text-xl font-semibold">
          Sign in to CHH Industry API
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <Input
            name="email"
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            variant="bordered"
            isRequired
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <Input
            name="password"
            type="password"
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your password"
            variant="bordered"
            isRequired
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <Button
            onPress={handleLogin}
            type="submit"
            color="primary"
            className="w-full"
          >
            Signin
          </Button>
        </div>
      </div>
      <div className="relative lg:flex hidden flex-col items-center justify-center w-8/12 h-full p-2 gap-2 overflow-hidden">
        <div className="absolute w-[400px] h-[400px] border-1 border-default rounded-full" />
        <div className="absolute w-[600px] h-[600px] border-1 border-default rounded-full" />
        <div className="absolute w-[800px] h-[800px] border-1 border-default rounded-full" />
        <div className="absolute w-[1000px] h-[1000px] border-1 border-default rounded-full" />
        {icons.map(({ Icon, color }, i) => (
          <OrbitIcon
            key={i}
            Icon={Icon}
            color={color}
            radius={300 + (i % 3) * 150}
            angle={(i * 360) / icons.length}
            duration={40 + i * 5}
          />
        ))}
      </div>
    </div>
  );
}
