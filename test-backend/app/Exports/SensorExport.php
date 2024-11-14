<?php

namespace App\Exports;

use App\Models\Sensor;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SensorExport implements FromView
{

    private $date;
    private $status;
    public function __construct($date, $status)
    {
        $this->date = $date;
        $this->status = $status;
    }

    public function view(): View
    {
        $items = Sensor::select(['suhu', 'temperature', 'status_a', 'status_b', 'created_at'])->orderBy('id', 'DESC');
        if ($this->status == '1' || $this->status === '0')
            $items->where('status_a', $this->status)->where('status_b', $this->status);
        if ($this->date)
            $items->whereDate('created_at', $this->date);
        $data = $items->get();

        if ($this->date) {
            $dateConvert = Carbon::parse($this->date)->translatedFormat('d F Y');
        } else {
            $dateConvert = 'Semua';
        }
        if ($this->status !== 'all') {
            if ($this->status === '0') {
                $statusConvert = 'Off';
            } elseif ($this->status === '0') {
                $statusConvert = 'On';
            } else {
                $statusConvert = 'Semua';
            }
        } else {
            $statusConvert = 'Semua';
        }

        return view('pages.sensor.export', [
            'items' => $data,
            'date' => $dateConvert,
            'status' => $statusConvert
        ]);
    }
}
