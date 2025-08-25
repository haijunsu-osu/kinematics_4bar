% Example 7.1 (Kinzel's book)
% Four-Bar Analysis
clear all;
clc;
close all;

r1=1;
r2=2;
r3=3.5;
r4=4;
th1=0;
beta=atan(1/2); %coupler angle
r6=2/cos(beta); %length AE

th2=(0:10:360)*pi/180; %driver

th3=zeros(1,length(th2));
th4=zeros(1,length(th2));

posA=zeros(length(th2),2); %position of crank point A
posB=zeros(length(th2),2); %position of output point B
posE=zeros(length(th2),2); %position of coupler point E
posOA=[0 0];
posOB=[1 0];

sigma=1; %assembly mode

for i = 1:length(th2)
    A=2*r1*r4*cos(th1)-2*r2*r4*cos(th2(i));
    B=2*r1*r4*sin(th1)-2*r2*r4*sin(th2(i));
    C=r1^2+r2^2+r4^2-r3^2-2*r1*r2*cos(th1-th2(i));
    
    %position analysis
    th4(i)=2*atan((-B+sigma*sqrt(B^2-C^2+A^2))/(C-A));
    th3(i)=atan2((r1*sin(th1)+r4*sin(th4(i))-r2*sin(th2(i))),(r1*cos(th1)+r4*cos(th4(i))-r2*cos(th2(i))));

    %coupler point E
    posA(i,:)=r2*[cos(th2(i)) sin(th2(i))];
    posB(i,:)=posA(i,:) + r3*[cos(th3(i)) sin(th3(i))];
    posE(i,:)=posA(i,:) + r6*[cos(th3(i)+beta) sin(th3(i)+beta)];
    
    linkage=[posOA; posA(i,:); posE(i,:); posB(i,:); posA(i,:); posB(i,:); posOB]
    %hold on
    %axis manual
    plot(linkage(:,1), linkage(:,2));
    axis([-5 5 -5 5])
   pause
end

%hold off

plot(th2,th3,th2,th4)
xlabel('Crank Angle')
ylabel('Coupler and Output Angle')
title('Coupler and Output Angles vs. Input Crank Angle')
grid on
set(gca,'XTick')


pause
plot(posE(:,1),posE(:,2))
xlabel('X')
ylabel('Y')
title('Plot of Trajectory of Coupler Point E')
grid on

