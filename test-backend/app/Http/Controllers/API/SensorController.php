<?php

namespace App\Http\Controllers\API;

use App\Exports\SensorExport;
use App\Http\Controllers\API\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Resources\SensorResource;
use App\Models\Sensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class SensorController extends Controller
{
    public function index()
    {
        $limit = request('limit') ?? 10;
        $status = request('status');
        $date = request('date');
        try {
            $items = Sensor::orderBy('id', 'DESC');
            if ($status == '1' || $status === '0')
                $items->where('status_a', $status)->where('status_b', $status);
            if ($date)
                $items->whereDate('created_at', $date);
            $data = $items->paginate($limit);
            $pagination = [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ];
            return ResponseFormatter::success(SensorResource::collection($data), "Suhu found.", 200, $pagination);
        } catch (\Throwable $th) {
            //throw $th;
            return ResponseFormatter::error(null, $th->getMessage(), 400);
        }
    }

    public function store()
    {
        $validator = Validator::make(request()->all(), [
            'suhu' => ['required'],
            'temperature' => ['required'],
            'status_a' => ['required', 'in:0,1'],
            'status_b' => ['required', 'in:0,1']
        ]);

        if ($validator->fails()) {
            return ResponseFormatter::validationError($validator->errors());
        }

        try {
            $data = request()->only(['suhu', 'temperature', 'status_a', 'status_b']);
            $sensor = Sensor::create($data);
            return ResponseFormatter::success($sensor, 'Sensor has been created successfully.', 200);
        } catch (\Throwable $th) {
            //throw $th;
            return ResponseFormatter::error(null, $th->getMessage(), 400);
        }
    }

    public function export()
    {
        $date = request('date');
        $status = request('status');
        return Excel::download(new SensorExport($date, $status), 'sensors.xlsx');
    }
}
