function y = vecloopeq(x,th1,th2,r1,r2,r3,r4)
%x=[th3 th4]
th3=x(1);
th4=x(2);
y=[r2*cos(th2)+r3*cos(x(1))-r4*cos(x(2))-r1*cos(th1) r2*sin(th2)+r3*sin(x(1))-r4*sin(x(2))-r1*sin(th1)];
end
