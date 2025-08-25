# Analytical Kinematic Analysis of Planar 4-Bar Linkage

This repository contains a Python implementation of the analytical kinematic analysis for a planar 4-bar linkage, converted from MATLAB code (`FourBar_PositionAnalysis.m`). The solution follows the methodology described in:

- "Analytical Position Velocity Acceleration Analysis of planar linkages (Kinzel book)"
- "Lecture 2 Analytical Positional Analysis.pdf"

## Solution Process

1. **Linkage Definition**: The four-bar mechanism is defined by its link lengths and input crank angle.
2. **Position Analysis**: For each input crank angle, the output and coupler angles are calculated analytically using trigonometric relationships.
3. **Coupler Point Calculation**: The position of the coupler point is determined for each configuration.
4. **Visualization**: The linkage is plotted for each step, showing the movement and configuration of the mechanism.
5. **Angle Plots**: The coupler and output angles are plotted against the input crank angle to visualize the kinematic behavior.

## How to Run

1. Install Python 3 and the required packages:
   - `numpy`
   - `matplotlib`

2. Run the script:
   ```bash
   python FourBar_PositionAnalysis.py
   ```

## Files
- `FourBar_PositionAnalysis.py`: Main Python script for kinematic analysis and visualization.
- `FourBar_PositionAnalysis.m`: Original MATLAB code.
- `Analytical Position Velocity Acceleration Analysis of planar linkages (Kinzel book).pdf`: Reference material.
- `Lecture 2 Analytical Positional Analysis.pdf`: Lecture notes.

## References
- Analytical Position Velocity Acceleration Analysis of planar linkages (Kinzel book).pdf
- Lecture 2 Analytical Positional Analysis.pdf
- Lecture notes on positional analysis of planar linkages
- Waldron, K.J., Kinzel, G.L., Agrawal, S.K., "Kinematics, Dynamics, and Design of Machinery, Third Edition", John Wiley & Sons, 2016. [Amazon link](https://www.amazon.com/Kinematics-Dynamics-Machinery-Kenneth-Waldron/dp/1118933281)

---

Feel free to modify the link lengths and parameters in the script to analyze different 4-bar mechanisms.
