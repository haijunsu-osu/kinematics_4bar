% Four-Bar Analysis
% Use Newton Iteration approch
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

th2list=(0:1:360)*pi/180; %driver
n=length(th2list);

th3list=zeros(n,1);
th4list=zeros(n,1);
pAlist=zeros(n,2);
pBlist=zeros(n,2);
pElist=zeros(n,2);

th2=0;
x0=[-pi/3 -pi/3];

%th2=2*pi/3
%x0=[pi/6 pi/3]

f = @(x) vecloopeq(x,th1,th2,r1,r2,r3,r4);
solth3th4=fsolve(f,x0);
th3=solth3th4(1);
th4=solth3th4(2);
pA=r2*[cos(th2) sin(th2)]
pE=pA+2*[cos(th3) sin(th3)]+1*[cos(th3+pi/2) sin(th3+pi/2)]
OA=[0 0]
OB=[1 0]

for i = 1:length(th2list)
    th2=th2list(i);
    f = @(x) vecloopeq(x,th1,th2,r1,r2,r3,r4);
    solth3th4=fsolve(f,x0);
    th3=solth3th4(1);
    th4=solth3th4(2);
    th3list(i)=th3;
    th4list(i)=th4;
    x0=solth3th4;
    
    pAlist(i,:)=r2*[cos(th2) sin(th2)];
    pBlist(i,:)=OB+r4*[cos(th4) sin(th4)];
    pElist(i,:)=pAlist(i,:)+r6*[cos(th3+beta) sin(th3+beta)];
    
end
 
plot(th2list,th3list,th2list,th4list)
xlabel('Crank Angle')
ylabel('Coupler and Output Angle')
title('Coupler and Output Angles vs. Input Crank Angle')
grid on
set(gca,'XTick')


