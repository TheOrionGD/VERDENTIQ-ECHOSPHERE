from fastapi import APIRouter
from app.schemas.domain import (
    OptimizationRequest, 
    InstitutionOptimizationRequest, 
    OptimizationAction
)
from typing import List
from ortools.linear_solver import pywraplp

router = APIRouter()

def solve_single_household(request: OptimizationRequest, household_id: str = None) -> List[OptimizationAction]:
    if not request.candidates:
        return []

    solver = pywraplp.Solver.CreateSolver('SCIP')
    if not solver:
        return []

    # Create variables
    x = {}
    for i, candidate in enumerate(request.candidates):
        x[i] = solver.IntVar(0, 1, f'x_{i}')

    # Constraint: limit total number of actions
    solver.Add(sum(x[i] for i in range(len(request.candidates))) <= request.max_actions)

    # Objective
    objective = solver.Objective()
    for i, candidate in enumerate(request.candidates):
        # We assume base_carbon_delta and base_cost_delta represent savings if negative,
        # so we take their absolute value to maximize them, or assume they are positive metrics.
        # Let's assume negative means reduction (good). So we subtract them (or add negative).
        # To maximize reduction: maximize absolute value.
        carbon_score = abs(candidate.base_carbon_delta) * request.weights.carbon
        cost_score = abs(candidate.base_cost_delta) * request.weights.cost
        comfort_score = candidate.base_ease_score * request.weights.comfort
        
        total_score = carbon_score + cost_score + comfort_score
        objective.SetCoefficient(x[i], total_score)
        
    objective.SetMaximization()
    status = solver.Solve()

    results = []
    if status == pywraplp.Solver.OPTIMAL or status == pywraplp.Solver.FEASIBLE:
        # Collect selected items
        selected = []
        for i, candidate in enumerate(request.candidates):
            if x[i].solution_value() > 0.5:
                # Calculate the weighted score to rank them
                carbon_score = abs(candidate.base_carbon_delta) * request.weights.carbon
                cost_score = abs(candidate.base_cost_delta) * request.weights.cost
                comfort_score = candidate.base_ease_score * request.weights.comfort
                score = carbon_score + cost_score + comfort_score
                
                selected.append((score, candidate))
                
        # Sort by score descending for ranking
        selected.sort(key=lambda item: item[0], reverse=True)
        
        for rank, (score, candidate) in enumerate(selected, start=1):
            results.append(OptimizationAction(
                id=candidate.id,
                title=candidate.title,
                category=candidate.category,
                rank=rank,
                description=candidate.description,
                carbonDeltaKg=candidate.base_carbon_delta,
                costDeltaUSD=candidate.base_cost_delta,
                ecoPointsBonus=candidate.base_eco_points,
                easeScore=candidate.base_ease_score,
                household_id=household_id
            ))
            
    return results

@router.post("/user/optimization-actions", response_model=List[OptimizationAction])
async def user_optimization_actions(request: OptimizationRequest):
    return solve_single_household(request)

@router.post("/student/optimization-actions", response_model=List[OptimizationAction])
async def student_optimization_actions(request: OptimizationRequest):
    return solve_single_household(request)

@router.post("/institution/milp-scenarios", response_model=List[OptimizationAction])
async def institution_milp_scenarios(request: InstitutionOptimizationRequest):
    solver = pywraplp.Solver.CreateSolver('SCIP')
    if not solver:
        return []

    x = {} # dict mapping (household_id, candidate_idx) to solver var
    
    # Create variables and local constraints
    for hh_id, candidates in request.households.items():
        hh_vars = []
        for i, candidate in enumerate(candidates):
            var = solver.IntVar(0, 1, f'x_{hh_id}_{i}')
            x[(hh_id, i)] = var
            hh_vars.append(var)
        
        # Max actions per household constraint
        solver.Add(sum(hh_vars) <= request.max_actions_per_household)

    # Global objective
    objective = solver.Objective()
    for hh_id, candidates in request.households.items():
        for i, candidate in enumerate(candidates):
            carbon_score = abs(candidate.base_carbon_delta) * request.weights.carbon
            cost_score = abs(candidate.base_cost_delta) * request.weights.cost
            comfort_score = candidate.base_ease_score * request.weights.comfort
            
            total_score = carbon_score + cost_score + comfort_score
            objective.SetCoefficient(x[(hh_id, i)], total_score)
            
    objective.SetMaximization()
    status = solver.Solve()

    results = []
    if status == pywraplp.Solver.OPTIMAL or status == pywraplp.Solver.FEASIBLE:
        selected = []
        for hh_id, candidates in request.households.items():
            for i, candidate in enumerate(candidates):
                if x[(hh_id, i)].solution_value() > 0.5:
                    carbon_score = abs(candidate.base_carbon_delta) * request.weights.carbon
                    cost_score = abs(candidate.base_cost_delta) * request.weights.cost
                    comfort_score = candidate.base_ease_score * request.weights.comfort
                    score = carbon_score + cost_score + comfort_score
                    selected.append((score, candidate, hh_id))
                    
        # Sort globally across portfolio
        selected.sort(key=lambda item: item[0], reverse=True)
        
        for rank, (score, candidate, hh_id) in enumerate(selected, start=1):
            results.append(OptimizationAction(
                id=candidate.id,
                title=candidate.title,
                category=candidate.category,
                rank=rank, # Global rank
                description=candidate.description,
                carbonDeltaKg=candidate.base_carbon_delta,
                costDeltaUSD=candidate.base_cost_delta,
                ecoPointsBonus=candidate.base_eco_points,
                easeScore=candidate.base_ease_score,
                household_id=hh_id
            ))
            
    return results
